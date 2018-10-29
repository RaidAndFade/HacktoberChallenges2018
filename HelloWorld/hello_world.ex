# By Jonathan Sandgren - https://github.com/jonsandg

name = IO.gets("Enter your name: ")
name = String.trim(name, "\n")
IO.write("Hello " <> name <> "!")