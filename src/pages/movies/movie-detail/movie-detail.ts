import { MovieProvider } from './../../../providers/movie/movie';
import { Movie } from './../../../interface/movie';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy } from '@angular/core';
import { AlertController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../../providers/database/database';

@Component({
  selector: 'movie-detail',
  templateUrl: 'movie-detail.html'
})
export class MovieDetailPage implements OnDestroy{

  public addFavorito: string = '';
  public docID: string = '';
  public isEditable: boolean = false;
  public title: string = 'Minha Lista';
  private _COLLECTION: string = "Favoritos";

  movie:Movie;
  private movieSub: Subscription;
  constructor(
    private navParams: NavParams,
    private movieProvider:MovieProvider,
    public params: NavParams,
    private _DB: DatabaseProvider,
    private _ALERT: AlertController) {

     if(params.get('isEdited'))
     {
         let record = params.get('record');
         this.addFavorito = record.location.addFavorito;
         this.docID = record.location.id;
         this.isEditable = true;
         this.title = 'Update this document';
     }
  }

  favorito(movieId) {
     let addFavorito: string = movieId;

     if(this.isEditable)
     {
       this._DB.updateDocument(this._COLLECTION,
        this.docID, {
          addFavorito: addFavorito
        })
        .then((data) =>
        {
           this.displayAlert('Sucesso!', 'Sua lista de favoritos foi atualizada');
        })
        .catch((error) =>
        {
           this.displayAlert('Erro ao atualizar, tente novamente!', error.message);
        });
     }
     else {
        this._DB.addDocument(this._COLLECTION,{
          addFavorito: addFavorito
        })
        .then((data) =>
        {
          this.displayAlert('Sucesso!', 'Adicionado na sua lista de favoritos');
        })
        .catch((error) =>
        {
          this.displayAlert('Erro ao adicionar, tente novamente!', error.message);
        });
     }
  }

  displayAlert(title: string, message: string) : void
  {
     let alert: any = this._ALERT.create({
        title: title,
        subTitle: message,
        buttons: ['Ok']
     });
     alert.present();
  }

  ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.movieSub = this.movieProvider.getMovieDetails(id)
    .subscribe(movie => this.movie = movie);
  }

  public ngOnDestroy(): void {
      if(this.movieSub){
        this.movieSub.unsubscribe();
      }
  }
  videoResults(movie){
    if (movie.videos.results.length > 0){
      return true;
    }
    return false;
  }

  trailer(URL) {
    window.open(URL);
  }
}
