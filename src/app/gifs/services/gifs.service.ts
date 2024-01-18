import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  public gifList: Gif[] = [];
  //Es privado para que no pueda ser editado por otros elementos
  private _tagsHistory: string[] = [];
  private apiKey: string = 'Y2m1pvtIFjoJM3kGXWTbT7MhYmaVMGQg';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs service ready');
   }

  get tagsHistory(){
    return [...this._tagsHistory];
  }


  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this.tagsHistory.includes(tag)){
      this._tagsHistory = this.tagsHistory.filter((oldTag)=>oldTag !==tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history',JSON.stringify(this._tagsHistory));
  }
  private loadLocalStorage():void{
    if(!localStorage.getItem('history'))return
    this._tagsHistory =JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagsHistory[0]);

  }

  searchTag(tag:string){
    if(tag.length === 0) return;
    this.organizeHistory(tag);

    //fORMAS DE HACERLO
   /*1.  fetch('https://api.giphy.com/v1/gifs/search?api_key=Y2m1pvtIFjoJM3kGXWTbT7MhYmaVMGQg&q=Valorant&limit=10')
    .then( (res:any) => res.json())
    .then( (data:any) => console.log(data)) */

   /*2.  const res = await fetch('https://api.giphy.com/v1/gifs/search?api_key=Y2m1pvtIFjoJM3kGXWTbT7MhYmaVMGQg&q=Valorant&limit=10')
    const data = await res.json();
    console.log(data); */


    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)
    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params: params })
      .subscribe( (res) =>{
        this.gifList = res.data;
        /* console.log({gifs: this.gifList})
        console.log(res); */
      } )
  }
}
