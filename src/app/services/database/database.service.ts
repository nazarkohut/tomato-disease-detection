import {Injectable, signal, WritableSignal} from '@angular/core';
import {databaseConfig} from "../../utils/constants";
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from "@capacitor-community/sqlite";
import {HttpClient} from '@angular/common/http';

export interface WikiInfo {
  disease_name: string;
  aliases?: string;
  disease_image_path: string;
  description: string;
  vocabulary?: string;
  treatment: string;
  prevention?: string;
  type?: string;
  cause_photo?: string;
  cause_photo_title?: string;
  other_crops?: string;
}

export interface DatabaseWikiInfo {
  id: number,
  disease_name: string;
  aliases?: string;
  disease_image_path: string;
  description: string;
  vocabulary?: string;
  treatment: string;
  prevention?: string;
  type?: string;
  cause_photo?: string;
  cause_photo_title?: string;
  other_crops?: string;
}

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
  private _wikiRecords: WritableSignal<DatabaseWikiInfo[]> = signal<DatabaseWikiInfo[]>([]);


  constructor(private http: HttpClient) {
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

    const predictionSchema = `CREATE TABLE IF NOT EXISTS Prediction(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      webViewPath TEXT NOT NULL,
      fileName TEXT NOT NULL,
      predictionTime INTEGER NOT NULL
    )`

    await this.db.execute(predictionSchema);

    const wikiSchema = `
    CREATE TABLE IF NOT EXISTS Wiki(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disease_name TEXT NOT NULL,
      aliases TEXT,
      disease_image_path TEXT NOT NULL,
      description TEXT NOT NULL,
      vocabulary TEXT,
      treatment TEXT NOT NULL,
      prevention TEXT,
      type TEXT,
      cause_photo TEXT,
      cause_photo_title TEXT,
      other_crops TEXT
    )
  `;

    await this.db.execute(wikiSchema);

    // Create many to many connection
    const predictionWikiSchema = `
    CREATE TABLE IF NOT EXISTS PredictionWiki(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prediction_id INTEGER NOT NULL,
      wiki_id INTEGER NOT NULL,
      FOREIGN KEY (prediction_id) REFERENCES Prediction(id),
      FOREIGN KEY (wiki_id) REFERENCES Wiki(id)
    )
  `;

    await this.db.execute(predictionWikiSchema);

    await this.insertStaticWikiInfo();
  }


  async insertStaticWikiInfo() {
    const diseases = ['early-blight', 'late-blight', 'leaf-miner', 'leaf-mold', 'mosaic-virus', 'septoria', 'yellow-leaf-curl'];
    diseases.forEach(disease => {
      this.http.get<WikiInfo>(`assets/data/wiki/${disease}.json`).subscribe(
        async (wikiInfo: any) => {
          console.log("WIKI INFO inside forEach Loop:", wikiInfo)
          await this.insertWikiInfo(wikiInfo);
        }
      )
    })
  }

  async insertWikiInfo(wikiInfo: WikiInfo): Promise<void> {
    const existingWiki = await this.findWikiByDiseaseName(wikiInfo.disease_name);
    if (!existingWiki) {
      const query = `
        INSERT INTO Wiki (disease_name, aliases, disease_image_path, description, vocabulary, treatment, prevention, type, cause_photo, cause_photo_title, other_crops)
        VALUES ('${wikiInfo.disease_name}',
        '${wikiInfo.aliases}',
        '${wikiInfo.disease_image_path}',
        '${wikiInfo.description}',
        '${wikiInfo.vocabulary}',
        '${wikiInfo.treatment}',
        '${wikiInfo.prevention}',
        '${wikiInfo.type}',
        '${wikiInfo.cause_photo}',
        '${wikiInfo.cause_photo_title}',
        '${wikiInfo.other_crops}')
      `;
      await this.db.execute(query);
    }
  }

  async findWikiByDiseaseName(diseaseName: string): Promise<DatabaseWikiInfo | null> {
    const query = `
      SELECT * FROM Wiki
      WHERE disease_name = '${diseaseName}'
    `;
    const result = await this.db.query(query);
    console.log("Insertion result", result)
    console.log("Insertion result values", result.values)
    if (result.values && result.values.length > 0) {
      return result.values![0] as DatabaseWikiInfo;
    }
    return null;
  }

  async loadWiki() {
    // Convert the Unix Time to a date format and extract the day component
    const query = `
    SELECT * FROM Wiki`;
    const wikiRecords = await this.db.query(query);
    this._wikiRecords.set(wikiRecords.values || []);
  }

  getPredictions() {
    return this._predictions();
  }

  getWikiRecords() {
    return this._wikiRecords();
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
