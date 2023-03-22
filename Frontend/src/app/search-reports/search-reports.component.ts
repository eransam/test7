import { Component, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportService } from '../services/reports.service';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-search-reports',
  templateUrl: './search-reports.component.html',
  styleUrls: ['./search-reports.component.scss'],
})
export class SearchReportsComponent implements OnInit {
  users: any[] = [];
  users2: any[];

  DetailsForm: FormGroup;
  monthInput: FormControl;
  usernameInput: FormControl;
  detailsFromformUsername: any = '';
  detailsFromformMonth: any = '';

  filteredUsers: Observable<string[]>;

  usernameControl = new FormControl();

  constructor(
    private reportService: ReportService,
    public router: Router,
    private notify: NotifyService
  ) {
    // Initialize the filteredUsers observable

    this.filteredUsers = this.usernameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  async ngOnInit(): Promise<void> {
    (this.monthInput = new FormControl('', Validators.required)),
      (this.usernameInput = new FormControl('', Validators.required));
    this.DetailsForm = new FormGroup({
      nameBox: this.monthInput,
      priceBox: this.usernameInput,
    });

    this.users2 = await this.reportService.getFullNameAnrUserId();
    for (let i = 0; i < this.users2.length; i++) {
      this.users.push(`${this.users2[i].fullname}-${this.users2[i].userId}`);
    }
    console.log('this.users: ', this.users);
  }

  async add() {
    this.detailsFromformUsername = this.usernameControl.value;
    this.detailsFromformMonth = this.monthInput.value;

    const results = await this.reportService.bringRepMin(
      this.detailsFromformUsername,
      this.detailsFromformMonth
    );
    console.log('results: ', results);

    this.notify.success('added');
    this.DetailsForm.reset();
    // this.router.navigateByUrl('/admin-home');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) =>
      user.toLowerCase().includes(filterValue)
    );
  }

  selectedMonth: string;
  username: string;
  search() {
    // TODO: implement search functionality using selectedMonth and username variables
  }
}
