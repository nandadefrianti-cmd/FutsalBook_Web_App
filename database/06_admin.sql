UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'salwahasnafadhila@gmail.com');

SELECT p.nama, p.role, u.email
FROM profiles p JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';