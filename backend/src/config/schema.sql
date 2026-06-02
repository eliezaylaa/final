CREATE TABLE If NOT EXISTS users(
id SERIAL PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
role VARCHAR(100) DEFAULT 'user',
is_active BOOLEAN DEFAULT true,
salary DECIMAL(10,2) DEFAULT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shifts(
  id SERIAL PRIMARY KEY,
user_id INT REFERENCES users,
date DATE,
start_time TIME,
end_time TIME,
check_in TIMESTAMP,
check_out TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW()


);

CREATE TABLE IF NOT EXISTS products(
 id SERIAL PRIMARY KEY,
    name VARCHAR (100)

);

CREATE TABLE IF NOT EXISTS invoices(

    id SERIAL PRIMARY KEY,
   customer_id INT REFERENCES users(id),
   total DECIMAL(10,2),
   payment_method VARCHAR(20),
   is_paid BOOLEAN DEFAULT false,
   paid_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT NOW()

);
CREATE TABLE IF NOT EXISTS invoice_items(

 id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id),
    product_id INT REFERENCES products(id),
    quantity INT,
    item_price DECIMAL (10,2)


);


CREATE TABLE IF NOT EXISTS refresh_token(
 id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    token TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);




