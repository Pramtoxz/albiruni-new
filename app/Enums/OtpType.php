<?php

namespace App\Enums;

enum OtpType: string
{
    case Login = 'login';
    case Register = 'register';
    case PasswordReset = 'password_reset';
}
