INSERT INTO department (name)
VALUES ('Lawyer'),
       ('Finance'),
       ('Developer'),
       ('Human Resources');
       
INSERT INTO role (id, title, department, salary)
VALUES (1, 'Lawyer', 987000.00, 1),
       (2, 'Finance',  789000.00, 2),
       (3, 'Developer', 100700.00, 3),
       (4, 'Human Resources', 400990.00, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ('Tim', 'Velasquez',1, NULL),
       ('Matt', 'Unrein', 1, NULL),
       ('Nathan','Ebbesen', 3, NULL),
       ('Ryan', 'Satano', 4 , NULL);