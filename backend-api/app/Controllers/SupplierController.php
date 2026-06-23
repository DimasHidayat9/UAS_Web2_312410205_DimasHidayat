<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class SupplierController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('supplier')->orderBy('id', 'DESC')->get()->getResultArray();
        return $this->respond($data, 200);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $row = $db->table('supplier')->getWhere(['id' => $id])->getRowArray();
        if (!$row) return $this->failNotFound('Supplier tidak ditemukan');
        return $this->respond($row, 200);
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $data = [
            'nama_supplier' => $this->request->getVar('nama_supplier'),
            'alamat'        => $this->request->getVar('alamat'),
            'no_telp'       => $this->request->getVar('no_telp'),
            'email'         => $this->request->getVar('email'),
        ];
        if (empty($data['nama_supplier'])) {
            return $this->fail(['status' => 400, 'error' => 'Nama supplier wajib diisi'], 400);
        }
        $db->table('supplier')->insert($data);
        return $this->respondCreated(['status' => 201, 'message' => 'Supplier berhasil ditambahkan']);
    }

    public function update($id = null)
    {
        $db = \Config\Database::connect();
        $data = [
            'nama_supplier' => $this->request->getVar('nama_supplier'),
            'alamat'        => $this->request->getVar('alamat'),
            'no_telp'       => $this->request->getVar('no_telp'),
            'email'         => $this->request->getVar('email'),
        ];
        $db->table('supplier')->where('id', $id)->update($data);
        // Sync nama supplier di tabel barang
        $db->table('barang')->where('id_supplier', $id)->update(['supplier' => $data['nama_supplier']]);
        return $this->respond(['status' => 200, 'message' => 'Supplier berhasil diupdate'], 200);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('supplier')->where('id', $id)->delete();
        return $this->respondDeleted(['status' => 200, 'message' => 'Supplier berhasil dihapus']);
    }
}