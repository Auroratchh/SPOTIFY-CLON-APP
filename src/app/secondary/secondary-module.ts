import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticContainer } from './static-container/static-container';
import { StaticChild } from './static-child/static-child';
import { FirstChild } from './first-child/first-child';
import { SecondChild } from './second-child/second-child';
import { HomeChild } from './home-child/home-child';
import { AppRoutingModule } from "../app-routing-module";
import { RouterLink } from '@angular/router';



@NgModule({
  declarations: [
    StaticContainer,
    StaticChild,
    FirstChild,
    SecondChild,
    HomeChild
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterLink
]
})
export class SecondaryModule { }
