import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authForm: string = "login";
  createForm: FormGroup;
  bodyColor;

  readonly loginCondition = {
    userId: ['', []],
    userPwd: ['', []],
  }
  readonly registerCondition = {
    userId: ['', []],
    userEmail: ['', []],
    userPwd: ['', []],
    userPhone: ['', []],
    userCode: ['', []],
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.bodyColor = $('body').css("background-color");



    this.createForm = this.formBuilder.group(this.loginCondition);
  }

  changeAuthForm(form: string) {
    this.authForm = form;

    if (this.authForm == "register") {
      $('body').css("background-color", "#f7f7f7");
      this.createForm = this.formBuilder.group(this.registerCondition);
    } else {
      $('body').css("background-color", this.bodyColor);
      this.createForm = this.formBuilder.group(this.loginCondition);
    }
  }

  sendCode() {
    let param = {
      email: this.createForm.value.userEmail,
      phone: this.createForm.value.userPhone,
    };

    this.http.post(`${environment.server.url}/api/auth/phone`, param)
      .subscribe(ret => {
        console.log("sendCode()", ret);
        console.log("param ", param);
      });

  }

  register() {
    let param = {
      name: this.createForm.value.userId,
      email: this.createForm.value.userEmail,
      phone: this.createForm.value.userPhone,
      code: this.createForm.value.userCode,
      password: this.createForm.value.userPwd,
    };

    this.http.post(`${environment.server.url}/api/auth/register`, param)
      .subscribe(ret => {
        $("#centralModalSuccess").modal('toggle').on('hidden.bs.modal', (e) => {
          this.authForm = "login";

          $('body').css("background-color", this.bodyColor);
          this.createForm = this.formBuilder.group(this.loginCondition);

        });
        console.log("register()", ret);
        console.log("param ", param);
      });
  }

  login() {
    let param = {
      email: this.createForm.value.userId,
      password: this.createForm.value.userPwd
    };

    console.log("param ", param);

    this.http.post(`${environment.server.url}/api/auth/login`, param)
      .subscribe((ret: any) => {
        localStorage.setItem("token", ret.token);
        $("#centralModalSuccess").modal('toggle').on('hidden.bs.modal', (e) => {
          this.router.navigate(['/home']);
        });
      });
  }


}
