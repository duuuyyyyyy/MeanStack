import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'booksapp';
  //set the link of the based route
  readonly APIUrl="http://localhost:5038/api/books/";


  genres = [
    "Fantasy","Science Fiction","Mystery","Thriller","Horror","Romance","Historical Fiction",
    "Literary Fiction","Young Adult","Children's","Non-Fiction","Biography","Memoir","Self-Help",
    "Business","Technology","Science","Philosophy","Poetry","Graphic Novel","Travel",
    "Health & Fitness","Spirituality","Cookbook"
  ];

  bookForm!: FormGroup;
  errorMessages: string[] = [];

  constructor(private http:HttpClient, private fb:FormBuilder){
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\\s]+$/)]],
      genre: [''],
      price: ['', [Validators.required]]
    });
  }

  get titleCtrl() { return this.bookForm.get('title'); }
  get descriptionCtrl() { return this.bookForm.get('description'); }
  get authorCtrl() { return this.bookForm.get('author'); }
  get genreCtrl() { return this.bookForm.get('genre'); }
  get priceCtrl() { return this.bookForm.get('price'); }
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
    if(this.bookForm.invalid){
      this.bookForm.markAllAsTouched();
      this.buildErrorSummary();
      return;
    }
    this.errorMessages = [];

    const rawPrice = this.bookForm.value.price;
    const trimmed = {
      title: (this.bookForm.value.title ?? '').toString().trim(),
      description: (this.bookForm.value.description ?? '').toString().trim(),
      author: (this.bookForm.value.author ?? '').toString().trim(),
      genre: this.bookForm.value.genre ?? '',
      price: rawPrice !== null && rawPrice !== undefined ? Number(rawPrice) : NaN
    };

    const duplicate = this.books.some((b:any)=> (b.title || '').trim().toLowerCase() === trimmed.title.toLowerCase());
    if(duplicate){
      alert("A book with this title already exists.");
      return;
    }

    const priceNum = trimmed.price;
    if(isNaN(priceNum) || priceNum <= 0){
      this.errorMessages = ['Price must be greater than 0.'];
      return;
    }

    var formData=new FormData();
    formData.append("title", trimmed.title);
    formData.append("description", trimmed.description);
    formData.append("author", trimmed.author);
    formData.append("genre", trimmed.genre);
    formData.append("price", priceNum.toString());
    this.http.post(this.APIUrl+'AddBook', formData).subscribe(data=>{
      alert(data);
      this.resetForm();
      this.refreshBooks()
    })
  }

  deleteBook(id:any){
      this.http.delete(this.APIUrl+'DeleteBook?id='+id).subscribe(data=>{
      alert(data);
      this.refreshBooks()
    })
  }

  resetForm(){
    this.bookForm.reset({
      title: '',
      description: '',
      author: '',
      genre: '',
      price: ''
    });
    this.errorMessages = [];
  }

  private buildErrorSummary(){
    const errs: string[] = [];
    const c = this.bookForm.controls;
    if(c['title'].errors){
      if(c['title'].errors['required']) errs.push('Title is required.');
      if(c['title'].errors['minlength']) errs.push('Title must be at least 3 characters.');
      if(c['title'].errors['maxlength']) errs.push('Title must be at most 100 characters.');
    }
    if(c['description'].errors?.['maxlength']) errs.push('Description must be 1000 characters or fewer.');
    if(c['author'].errors){
      if(c['author'].errors['required']) errs.push('Author is required.');
      if(c['author'].errors['minlength']) errs.push('Author must be at least 3 characters.');
      if(c['author'].errors['pattern']) errs.push('Author can contain only letters and spaces.');
    }
    if(c['price'].errors){
      if(c['price'].errors['required']) errs.push('Price is required.');
    }
    this.errorMessages = errs;
  }
}
