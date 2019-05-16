import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatInputModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  exports: [
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule
  ],
  declarations: []
})
export class AppMaterialModule {}

import { AppRoutingModule } from './app.routing';
//services
import { Web3Service } from './services/web3/web3.service';
import { SelectedRowService } from './services/selected-row/selected-row.service';
//components
import { RootComponent } from './components/root/root.component';
import { HomeComponent } from './components/home/home.component';
import { BlockTableComponent } from './components/block-table/block-table.component';
import { BlockInspectionComponent } from './components/block-inspection/block-inspection.component';

@NgModule({
  declarations: [
    RootComponent,
    HomeComponent,
    BlockTableComponent,
    BlockInspectionComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule
  ],
  providers: [
    Web3Service,
    SelectedRowService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
