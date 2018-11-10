//Made by Li223
using System;

namespace HelloWorldCSharp
{
    public class Program 
    {
        public static void Main() 
        {
           Console.WriteLine("Enter your name:");
           var x = Console.ReadLine();
           Console.WriteLine($"Hello, {x}!");
        }
    }
}
