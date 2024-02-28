import {Injectable, signal, WritableSignal} from '@angular/core';
import {databaseConfig} from "../../utils/constants";
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from "@capacitor-community/sqlite";


export interface Prediction {
  // fileText: string,
  webViewPath: string,
  fileName: string,
  predictionTime: number
}

export interface DatabasePrediction {
  // fileText: string,
  id: string,
  webViewPath: string,
  fileName: string,
  predictionTime: number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private predictionTableName = databaseConfig["prediction-table-name"];
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private _predictions: WritableSignal<Prediction[]> = signal<Prediction[]>([]);
  private _predictionsDays: WritableSignal<Prediction[]> = signal<Prediction[]>([]);
  private _predictionsByDay: WritableSignal<DatabasePrediction[]> = signal<DatabasePrediction[]>([]);


  constructor() {
  }


  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      this.predictionTableName,
      false,
      'no-encryption',
      1,
      false
    )

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS Prediction(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      webViewPath TEXT NOT NULL,
      fileName TEXT NOT NULL,
      predictionTime INTEGER NOT NULL
    )`

    await this.db.execute(schema)
  }

  getPredictions() {
    return this._predictions();
  }

  getPredictionsDays() {
    return this._predictionsDays();
  }

  getPredictionsByDays() {
    return this._predictionsByDay();
  }

  async loadAllPredictions() { // TODO: I do not think this is the most efficient way to make updates
    const query = `SELECT * from Prediction`
    const predictions = await this.db.query(query);
    this._predictions.set(predictions.values || []);
  }


  async loadPredictionsDays() {
    // Convert the Unix Time to a date format and extract the day component
    const query = `
    SELECT predictionTime FROM Prediction`;
    const predictionsDays = await this.db.query(query);
    console.log("loadPredictionsDays - gave us: ", predictionsDays);
    this._predictionsDays.set(predictionsDays.values || []);
  }

  async loadPredictionsByDay(year: string, month: string, day: string) {
    console.log("loadPredictionsByDay(year-month-day)", `${year}-${month}-${day}`);
    const query = `
    SELECT * FROM Prediction
    WHERE strftime('%Y-%m-%d', datetime(predictionTime, 'unixepoch')) = '${year}-${month}-${day}'`;
    const predictions = await this.db.query(query);
    this._predictionsByDay.set(predictions.values || []);
  }

  async insertPrediction(prediction: Prediction): Promise<string> {
    const query = `
      INSERT INTO Prediction (webViewPath, fileName, predictionTime)
      VALUES ('${prediction.webViewPath}', '${prediction.fileName}', '${prediction.predictionTime}')`;


    await this.db.execute(query);

    // Get the last inserted ID
    const result = await this.db.query("SELECT last_insert_rowid() as id");
    const insertedId = result.values?.[0]?.id;
    // Update the cached predictions
    await this.loadAllPredictions();
    return insertedId;
  }

  async findPredictionById(id: string): Promise<DatabasePrediction | null> {
    const query = `
    SELECT * FROM Prediction
    WHERE id = ${id}`;

    const result = await this.db.query(query);
    if (result.values && result.values.length > 0) {
      // Assuming Prediction is your model/interface
      return result.values?.[0] as DatabasePrediction;
    }
    return null;
  }
}
