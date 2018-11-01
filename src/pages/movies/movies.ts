import { MovieProvider } from '../../providers/movie/movie';
import { MovieDetailPage } from './movie-detail/movie-detail';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'page-movies',
  templateUrl: 'movies.html',
  providers: [
    MovieProvider
  ]
})
export class MoviesPage {

  public populares: any;
  public mais_votados: any;
  public acao: any;
  public comedia: any;
  public drama: any;
  public animacao: any;
  public documentario: any;

  @ViewChild('filmSlider') filmSlider: Slides;

  constructor(public navCtrl: NavController, public MovieProvider: MovieProvider, private _DB: DatabaseProvider, public authProvider: AuthProvider) { }

  ionViewDidLoad(){
   this.getPopulares();
   this.getTopRated();
   this.getGenres();
  }

  getPopulares(): void {
    let observable = this.MovieProvider.getPopularMovie().subscribe(
      data => {
        const obj = (data as any);
        const obj_json = JSON.parse(obj._body);
        this.populares = obj_json.results;
      }, error => {
        console.log(error);
      },
      () => observable.unsubscribe()
     );
  }

  getTopRated(): void {
    let observable = this.MovieProvider.getTopRatedMovie().subscribe(
      data => {
        const obj = (data as any);
        const obj_json = JSON.parse(obj._body);
        this.mais_votados = obj_json.results;
      }, error => {
        console.log(error);
      },
      () => observable.unsubscribe()
     );
  }

  async getGenres() {
    try {
      const response  = await this.MovieProvider.getMoviesByGenre(28).toPromise();
      this.acao = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.MovieProvider.getMoviesByGenre(35).toPromise();
      this.comedia = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.MovieProvider.getMoviesByGenre(18).toPromise();
      this.drama = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.MovieProvider.getMoviesByGenre(16).toPromise();
      this.animacao = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.MovieProvider.getMoviesByGenre(99).toPromise();
      this.documentario = response.json().results;
    }
    catch(e) { console.error(e); }
  }

  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.navCtrl.setRoot('LoginPage');
  }

  goToDetails(filme) {
    this.navCtrl.push(MovieDetailPage, {id: filme.id});
  }
}