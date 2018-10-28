// By: Jordan Skophamer - https://github.com/jordan-skophammer

#include <iostream>
#include <string>
using namespace std;

int main ()
{
  string name;
  cout << "What's your name? ";
  getline (cin, name);
  cout << "Hello " << name << ".\n";
  return 0;
}
