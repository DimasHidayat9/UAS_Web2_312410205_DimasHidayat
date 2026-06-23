<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class HistoriController extends ResourceController
{
    protected $format = 'json';

    // GET - Ambil semua histori
    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('histori_barang');
        $builder->select('histori_barang.*, barang.nama_barang, barang.supplier');
        $builder->join('barang', 'barang.id = histori_barang.id_barang');
        $builder->orderBy('histori_barang.id', 'DESC');
        $query = $builder->get();

        return $this->respond($query->getResultArray(), 200);
    }

    // POST - Tambah histori baru + update stok otomatis
    public function create()
    {
        $id_barang   = $this->request->getVar('id_barang');
        $jenis       = $this->request->getVar('jenis');
        $jumlah      = (int) $this->request->getVar('jumlah');
        $keterangan  = $this->request->getVar('keterangan');

        $db = \Config\Database::connect();

        // Cek stok saat ini
        $barang = $db->table('barang')->getWhere(['id' => $id_barang])->getRow();
        if (!$barang) {
            return $this->failNotFound('Barang tidak ditemukan');
        }

        // Hitung stok baru
        if ($jenis === 'masuk') {
            $stok_baru = $barang->stok + $jumlah;
        } else {
            if ($barang->stok < $jumlah) {
                return $this->fail(['status' => 400, 'error' => 'Stok tidak mencukupi'], 400);
            }
            $stok_baru = $barang->stok - $jumlah;
        }

        // Simpan histori
        $db->table('histori_barang')->insert([
            'id_barang'  => $id_barang,
            'jenis'      => $jenis,
            'jumlah'     => $jumlah,
            'keterangan' => $keterangan,
        ]);

        // Update stok barang
        $db->table('barang')->where('id', $id_barang)->update(['stok' => $stok_baru]);

        return $this->respondCreated(['status' => 201, 'message' => 'Histori berhasil ditambahkan']);
    }

    // DELETE - Hapus histori
    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('histori_barang')->where('id', $id)->delete();
        return $this->respondDeleted(['status' => 200, 'message' => 'Histori berhasil dihapus']);
    }
}