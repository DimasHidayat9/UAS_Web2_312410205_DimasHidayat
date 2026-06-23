<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BarangController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('barang');
        $builder->select('barang.*, kategori.nama_kategori, supplier.nama_supplier as nama_supplier_rel, supplier.no_telp, supplier.email');
        $builder->join('kategori', 'kategori.id = barang.id_kategori');
        $builder->join('supplier', 'supplier.id = barang.id_supplier', 'left');
        $builder->orderBy('barang.id', 'DESC');
        return $this->respond($builder->get()->getResultArray(), 200);
    }

    public function summary()
    {
        $db = \Config\Database::connect();
        $totalBarang    = $db->table('barang')->countAllResults();
        $totalKategori  = $db->table('kategori')->countAllResults();
        $totalSupplier  = $db->table('supplier')->countAllResults();
        $totalStok      = $db->table('barang')->selectSum('stok')->get()->getRow()->stok ?? 0;

        return $this->respond([
            'status'          => 200,
            'total_barang'    => $totalBarang,
            'total_kategori'  => $totalKategori,
            'total_supplier'  => $totalSupplier,
            'total_stok'      => $totalStok
        ], 200);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('barang');
        $builder->select('barang.*, kategori.nama_kategori, supplier.nama_supplier as nama_supplier_rel');
        $builder->join('kategori', 'kategori.id = barang.id_kategori');
        $builder->join('supplier', 'supplier.id = barang.id_supplier', 'left');
        $builder->where('barang.id', $id);
        $row = $builder->get()->getRowArray();
        if (!$row) return $this->failNotFound('Barang tidak ditemukan');
        return $this->respond($row, 200);
    }

    public function getKategori()
    {
        $db = \Config\Database::connect();
        return $this->respond($db->table('kategori')->get()->getResultArray(), 200);
    }

    public function create()
    {
        $db = \Config\Database::connect();
        $id_supplier = $this->request->getVar('id_supplier');
        $supplier = $id_supplier ? $db->table('supplier')->getWhere(['id' => $id_supplier])->getRow() : null;

        $data = [
            'id_kategori'  => $this->request->getVar('id_kategori'),
            'nama_barang'  => $this->request->getVar('nama_barang'),
            'stok'         => $this->request->getVar('stok'),
            'harga'        => $this->request->getVar('harga'),
            'supplier'     => $supplier ? $supplier->nama_supplier : $this->request->getVar('supplier'),
            'id_supplier'  => $id_supplier,
        ];
        $db->table('barang')->insert($data);
        return $this->respondCreated(['status' => 201, 'message' => 'Barang berhasil ditambahkan']);
    }

    public function update($id = null)
    {
        $db = \Config\Database::connect();
        $id_supplier = $this->request->getVar('id_supplier');
        $supplier = $id_supplier ? $db->table('supplier')->getWhere(['id' => $id_supplier])->getRow() : null;

        $data = [
            'id_kategori'  => $this->request->getVar('id_kategori'),
            'nama_barang'  => $this->request->getVar('nama_barang'),
            'stok'         => $this->request->getVar('stok'),
            'harga'        => $this->request->getVar('harga'),
            'supplier'     => $supplier ? $supplier->nama_supplier : $this->request->getVar('supplier'),
            'id_supplier'  => $id_supplier,
        ];
        $db->table('barang')->where('id', $id)->update($data);
        return $this->respond(['status' => 200, 'message' => 'Barang berhasil diupdate'], 200);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('barang')->where('id', $id)->delete();
        return $this->respondDeleted(['status' => 200, 'message' => 'Barang berhasil dihapus']);
    }
}