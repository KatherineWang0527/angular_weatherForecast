import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { SearchFormRoutingModule } from './search-form-routing.module';
import {MatAutocompleteModule} from "@angular/material/autocomplete";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SearchFormRoutingModule,
    MatAutocompleteModule
  ]
})
export class SearchFormModule { }
