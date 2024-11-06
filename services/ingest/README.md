## Client arguments
The first argument is mode. The client program can run in 3 modes: full, read, and send:  
If running in full mode the client will both read from the pc, save to SQLite database and attempt to send to the server and is the default mode.  
If running read mode the client will only read from the pc and save to the the SQLite database without attempting to send to the server.  
If running send mode the client will send the data from the SQLite database until it is empty but not read any new data.

The second argument is the database URL for SQLite. The program will attempt to find the specified SQLite database at the given URL and if it can't find it will create a new one. If no database is given it will use the default value local_readings.db in the folder the program is executed from.

Example:
```bash
    cargo run -- -m full --db-url my_db
```