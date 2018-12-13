#!/usr/bin/tclsh

#By Marina Latini https://github.com/deneb-alpha

puts -nonewline "Enter your name: "
flush stdout
set name [gets stdin]

puts "Hello $name!"
