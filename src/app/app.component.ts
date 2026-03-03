import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'booksapp';
  //set the link of the based route
  readonly APIUrl="http://localhost:5038/api/books/";


  constructor(private http:HttpClient){
  }
  //initialize the books array
  books:any=[];

  refreshBooks(){
    this.http.get(this.APIUrl+'GetBooks').subscribe(data=>{
      this.books=data;
    })
  }
  ngOnInit(){
    this.refreshBooks();
  }
  addBook(){
    var newBook=(<HTMLInputElement>document.getElementById("newBook")).value;
    var newDesc=(<HTMLInputElement>document.getElementById("newDesc")).value;
    var newPrice=(<HTMLInputElement>document.getElementById("newPrice")).value;
    var newAuthor=(<HTMLInputElement>document.getElementById("newAuthor")).value;
    var newGenre=(<HTMLInputElement>document.getElementById("newGenre")).value;
    var formData=new FormData();
    formData.append("title", newBook);
    formData.append("description", newDesc);
    formData.append("price", newPrice.toString());
    formData.append("author", newAuthor);
    formData.append("genre", newGenre);
    this.http.post(this.APIUrl+'AddBook', formData).subscribe(data=>{
      alert(data);
      this.refreshBooks()
    })
  }

  deleteBook(id:any){
      this.http.delete(this.APIUrl+'DeleteBook?id='+id).subscribe(data=>{
      alert(data);
      this.refreshBooks()
    })
  }
}
