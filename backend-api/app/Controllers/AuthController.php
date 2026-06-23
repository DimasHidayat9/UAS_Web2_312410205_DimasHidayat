<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $db = \Config\Database::connect();
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $user = $db->table('users')->getWhere(['username' => $username])->getRow();

        if ($user && password_verify($password, $user->password)) {
            // Membuat secure token acak [cite: 34]
            $token = bin2hex(random_bytes(32));
            
            // Simpan token ke database
            $db->table('users')->where('id', $user->id)->update(['token' => $token]);

            return $this->respond([
                'status' => 200,
                'message' => 'Login Berhasil',
                'token' => $token,
                'username' => $user->username
            ], 200);
        }

        return $this->respond(['status' => 401, 'error' => 'Username atau Password salah!'], 401);
    }

    public function logout()
    {
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        if ($authHeader) {
            $token = explode(' ', $authHeader)[1] ?? '';
            $db = \Config\Database::connect();
            $db->table('users')->where('token', $token)->update(['token' => null]);
        }
        return $this->respond(['status' => 200, 'message' => 'Logout sukses'], 200);
    }
}