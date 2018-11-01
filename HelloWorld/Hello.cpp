//by sree - https://github.com/Phasmic
#include <iostream>

using namespace.std;

class HelloWorld
{
    int main()
    {
        char name[100];

        cout << "Enter your name: ";

        cin.getline(name, 100);

        cout << "\n hello, " << name;

        return 0;
    }
}