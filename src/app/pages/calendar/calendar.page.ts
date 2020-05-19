import { Component, OnInit, ViewChild } from '@angular/core';
import { LoansService } from 'src/app/services/loans.service';
import { Loan } from 'src/app/models/loan';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'rxjs/operators';
import { CalendarComponent } from "ionic2-calendar/calendar";
import { formatCurrency } from '@angular/common';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-ES'
  };
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  actualMonth;
  actualYear;
  loans: Loan[];
  showEvent: boolean;
  eventsDetail = [];
  constructor(private loansService: LoansService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.actualMonth = new Date().getMonth();
    this.actualYear = new Date().getFullYear();
    this.loadLoans();
  }

  async loadLoans() {
    await this.loadingService.presentLoading('Cargando...');
    await delay(300);
    this.loansService.getLoans('allActive').subscribe(data => {
      this.loans = data;
      this.loadEvents();
      this.loadingService.dismissLoading();
    }, err => {
      console.log(err);
      this.loadingService.dismissLoading();
    });
  }

  loadEvents() {
    this.loans.forEach(loan => {
      let loanDate = new Date(loan.initialDate);
      switch (loan.payBack) {
        case 'Por dia':
          this.loopEventMakerDays(loanDate, loan, 1);
          break;
        case 'Semanal':
          this.loopEventMakerDays(loanDate, loan, 7);
          break;
        case 'Quincenal':
          this.loopEventMakerDays(loanDate, loan, 15);
          break;
        case 'Mensual':
          this.loopEventMakerMonths(loanDate, loan, 1);
          break;
        case 'Trimestral':
          this.loopEventMakerMonths(loanDate, loan, 3);
          break;

        default:
          break;
      };
    });
    this.myCalendar.showEventDetail = false;
    this.myCalendar.loadEvents();
  }

loopEventMakerDays(loanDate: Date, loan: Loan, days: number) {
  do {    
    loanDate.setDate(loanDate.getDate() + days);
    if(loanDate.getMonth() == this.actualMonth && loanDate.getFullYear() == this.actualYear) {
      this.setCalendarEvents(loan, loanDate.getDate());
    }            
    } while ((loanDate.getMonth() <= this.actualMonth || loanDate.getFullYear() <= this.actualYear) 
    && loanDate.getFullYear() <= this.actualYear);
}

loopEventMakerMonths(loanDate: Date, loan: Loan, months: number) {
  do {    
    loanDate.setMonth(loanDate.getMonth() + months);
    if(loanDate.getMonth() - 1 == this.actualMonth && loanDate.getFullYear() == this.actualYear) {
      this.setCalendarEvents(loan, loanDate.getDate());
    }            
    } while ((loanDate.getMonth() - 1 <= this.actualMonth || loanDate.getFullYear() <= this.actualYear) 
    && loanDate.getFullYear() <= this.actualYear);
}

  setCalendarEvents(loan: Loan, day: number) {
    this.eventSource.push({
      title: {
        payback: loan.payBack,
        customer: loan.customer,
        loanAmount: formatCurrency(loan.loanAmount, 'en', '$')
      },
      startTime: new Date(Date.UTC(this.actualYear, this.actualMonth, day)),
      endTime: new Date(Date.UTC(this.actualYear, this.actualMonth, day + 1)),
      allDay: true
    });
  }
  onTimeSelected(ev: { selectedTime: Date, events: any[] }) {
    if (ev.events !== undefined && ev.events.length !== 0) {
      this.showEvent = true;
      this.eventsDetail = ev.events;
    } else {
      this.showEvent = false;
    }

  }

}
