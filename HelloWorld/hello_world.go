package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter your name: ")
    text, _ := reader.ReadString('\n')
    name_mod := strings.TrimSuffix(text, "\n")
  
    fmt.Print("Hello " + name_mod + "!")
    
}