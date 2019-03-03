import java.util.Scanner;

public class hello_world {
  public static void main(String[] args) 
  {
    Scanner input = new Scanner (System.in);
    //ask user for input
    System.out.print("Enter your name: ");
    String name = input.next();
    //greet user
    System.out.println("Hello "+name+"!");
  }
}

//to run this program - in terminal we need to run the below commands:

//javac hello_world.java
//java hello_world