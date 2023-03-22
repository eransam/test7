import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import store from 'src/app/redux/store';
import { ReportService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: UserModel;
  unsubscribe: Unsubscribe;
  constructor(public router: Router, private reportService: ReportService) {}

  ngOnInit(): void {
    this.user = store.getState().authState.user;
    this.unsubscribe = store.subscribe(() => {
      this.user = store.getState().authState.user;
    });
  }
  
  showRep() {
    this.router.navigateByUrl('/purchasedetailscomponent');
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
