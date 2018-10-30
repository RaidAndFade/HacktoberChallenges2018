#!/usr/bin/env escript

% By Jonathan Sandgren - https://github.com/jonsandg

main(_) ->
    Name = string:strip(io:get_line("Enter your name: "), right, $\n),

    io:fwrite("Hello ~s!~n", [Name]).
