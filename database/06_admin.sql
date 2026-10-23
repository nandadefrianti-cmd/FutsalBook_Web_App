UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'salwahasnafadhila@gmail.com');

-- Cek: harus menampilkan 1 baris dengan role = admin
SELECT p.nama, p.role, u.email
FROM profiles p JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';
