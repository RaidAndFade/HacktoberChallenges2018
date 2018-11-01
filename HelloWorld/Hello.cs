//by sree - https://github.com/Phasmic
using System;

namespace HelloWorld
{
    class HelloWorld
    {
        public static void Main(string[] args)
        {
            Console.Write("Enter your name: ");

            string name = Console.ReadLine();

            Console.WriteLine($"Hello, {name}");
        }
    }
}
