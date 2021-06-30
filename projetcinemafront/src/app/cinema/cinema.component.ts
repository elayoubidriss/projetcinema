import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes; public cinemas; public salles; public projections;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTicket;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes = data;
      },err=>{
        console.log(err);
      })
  }

  onGetCinemas(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas = data;
      },err=>{
        console.log(err);
      })
  }

  onGetSalles(c: any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles = data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections = data;
            },err=>{
              console.log(err);
            })
        })
      },err=>{
        console.log(err);
      })
  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTicket = [];
      },err=>{
        console.log(err);
      })
  }

  onSelectTicket(t: any) {
   if(!t.selected){
     t.selected=true;
     this.selectedTicket.push(t);
   }
   else{
     t.selected=false;
     this.selectedTicket.splice(this.selectedTicket.indexOf(t),1);
   }
  }

  getTicketClass(t: any) {
    let str = "btn ticket ";
    if(t.reserve==true){
      str+="btn-danger";
    }
    else if(t.selected){
      str+="btn-warning";
    }
    else{
      str+="btn-success"
    }
    return str;
  }

  onPayTickets(dataForm) {
    let tickets = [];
    this.selectedTicket.forEach(t=>{
      // @ts-ignore
      tickets.push(t.id);
    })
    dataForm.tickets=tickets;
    this.cinemaService.payerTicket(dataForm)
      .subscribe(data=>{
        alert("Tickets réservés avec succès");
        this.onGetTicketsPlaces(this.currentProjection)
      },err=>{
        console.log(err);
      })
  }
}
