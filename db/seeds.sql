INSERT INTO department (name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Interconnected"),
        ("Sales"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Engineering Manager", 120000, 1),
        ("Engineering Lead", 100000, 1),
        ("Staff Engineer", 80000, 1),
        ("Finance Manager", 85000, 2),
        ("Accountant", 70000, 2),
        ("Brand Advocate Manager", 95000, 3),
        ("Brand Advocate Sr. Analyst", 82000, 3),
        ("Brand Advocate Analyst", 70000, 3),
        ("Sales Manager", 75000, 4),
        ("Salesperson", 65000, 4),
        ("Legal Manager", 110000, 5),
        ("Lawyer", 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Vanessa", "Dane",  1, NULL),
        ("Luga", "Doe",  2, 1),
        ("Lorelei", "Dane",  3, 1), 
        ("Tennifer", "Doe",  4, NULL), 
        ("Jude", "Dane",  5, 4),
        ("Janice", "Bains",  6, NULL), 
        ("Roger", "Doe",  7, 6), 
        ("Mufasa", "Dan",  8, 6), 
        ("Van", "Doe",  9, NULL), 
        ("sir", "Dogg",  10, 9), 
        ("Jayne", "Smith",  11, NULL), 
        ("Jules", "Doe",  12, 11);