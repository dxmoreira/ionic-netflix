import { Movie } from '../../interface/movie';
import { MovieProvider } from '../../providers/movie/movie';
import { MovieDetailPage } from './movie-detail/movie-detail';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: "page-movies",
  templateUrl: "movies.html"
})
export class MoviesPage {

  public popular: any;
  public mais_votados: any;
  public acao: any;
  public comedia: any;
  public drama: any;
  public animacao: any;
  public documentario: any;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private movieProvider: MovieProvider,
    public authProvider: AuthProvider
  ) {}

  ionViewDidLoad() {
    this.getPopular();
    this.getGenres();
    this.getTopRated();
  }

  getPopular(): void {
    let observable = this.movieProvider.getPopularMovie().subscribe(
      data => {
        const obj = (data as any);
        const obj_json = JSON.parse(obj._body);
        this.popular = obj_json.results;
      }, error => {
        console.log(error);
      },
      () => observable.unsubscribe()
     );
  }

  getTopRated(): void {
    let observable = this.movieProvider.getTopRatedMovie().subscribe(
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
      const response  = await this.movieProvider.getMoviesByGenre(28).toPromise();
      this.acao = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.movieProvider.getMoviesByGenre(35).toPromise();
      this.comedia = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.movieProvider.getMoviesByGenre(18).toPromise();
      this.drama = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.movieProvider.getMoviesByGenre(16).toPromise();
      this.animacao = response.json().results;
    }
    catch(e) { console.error(e); }
    try {
      const response  = await this.movieProvider.getMoviesByGenre(99).toPromise();
      this.documentario = response.json().results;
    }
    catch(e) { console.error(e); }
  }

  searchMovie() {
    this.navCtrl.push("SearchPage")
  }

  goToDetails(id: string) {
    this.navCtrl.push(MovieDetailPage, { id: id });
  }

  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.navCtrl.setRoot('LoginPage');
  }

}