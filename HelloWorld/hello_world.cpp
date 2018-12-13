#include <iostream>
#include <string>
using namespace std;
 int main ()
{
  string name;
  cout << "Enter your name: ";
  getline (cin, name);
  cout << "\nHello " << name << "!\n";
  return 0;
}
