import { Movie } from '../../interface/movie';
import { MovieProvider } from '../../providers/movie/movie';
import { MovieDetailPage } from './movie-detail/movie-detail';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { Subject, Subscription } from 'rxjs/Rx';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@IonicPage()
@Component({
  selector: "page-movies",
  templateUrl: "movies.html"
})
export class MoviesPage implements OnDestroy {

  public populares: any;
  public mais_votados: any;
  public acao: any;
  public comedia: any;
  public drama: any;
  public animacao: any;
  public documentario: any;

  movieSearch$: Subject<string> = new Subject<string>();
  movieSelection = "popular";
  endPages: boolean = false;

  private lastSearch: string;

  movies: Movie[] = [];

  private page: number = 0;
  private subscription: Subscription;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private movieProvider: MovieProvider,
    public authProvider: AuthProvider
  ) {}

  getSelection(selection: string) {
    this.reset();
    this.movieSearch$.next(selection);
  }

  private reset(){
    this.page = 0;
    this.movies = [];
  }

  searchMovie(search: string) {
    this.reset();
    this.movieSearch$.next(search);
  }

  ionViewDidLoad() {
    this.subscription = this.movieSearch$
      .debounceTime(400)
      .switchMap((search: string) => {
        search = !!!search ? this.movieSelection : search;

        const searchOpt: boolean =
          search === "now_playing" ||
          search === "popular" ||
          search === "top_rated" ||
          search === "upcoming" ||
          !!!search
            ? true
            : false;

        this.lastSearch = search;
        this.page++;
        if (searchOpt) {
          return this.movieProvider.getList(search, this.page.toString());
        } else {
          return this.movieProvider.searchMovie(search, this.page.toString());
        }
      })
      .subscribe((movies: Movie[]) => {
        this.movies = this.movies.concat(movies);

        //console.log(this.endPages);

        if (movies.length === 0) {
          this.endPages = true;
        }
      });

    setTimeout(() => this.movieSearch$.next(""), 1000);
    this.getGenres();
    this.getTopRated();
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

  goToDetails(id: string) {
    this.navCtrl.push(MovieDetailPage, { id: id });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  async logOut(): Promise<void> {
    await this.authProvider.logoutUser();
    this.navCtrl.setRoot('LoginPage');
  }

}