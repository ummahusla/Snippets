<?php
//Example of inserting data into database table.
//This script has no limit and no checking for duplication. 
//Basically the same information can be inserted unlimited number of times.

//Connection to the database.
mysql_connect("localhost","root","");
//Selecting the database name.
mysql_select_db("employees");

//Data which supposed to be insert into database table.
$order = "INSERT INTO data_employees
            (name, address)
            VALUES
            ('Edvins Antonovs',
            'United Kingdom')";



//Declaring the order variable
$result = mysql_query($order);
//Checks if input was inserted
if($result) {
    echo("<br>Input went good");
} else {
    echo("<br>Input went wrong");
}
?>
