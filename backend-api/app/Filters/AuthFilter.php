<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');
        
        if (!$authHeader) {
            return Services::response()
                ->setJSON(['status' => 401, 'error' => 'Akses ditolak. Token tidak ditemukan.'])
                ->setStatusCode(401);
        }

        // Memecah string "Bearer <token>"
        $tokenArray = explode(' ', $authHeader);
        $token = $tokenArray[1] ?? '';

        $db = \Config\Database::connect();
        $user = $db->table('users')->getWhere(['token' => $token])->getRow();

        if (!$user || empty($token)) {
            return Services::response()
                ->setJSON(['status' => 401, 'error' => 'Sesi kedaluwarsa atau token tidak valid.'])
                ->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}