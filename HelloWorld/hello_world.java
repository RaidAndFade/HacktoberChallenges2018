// by Conny Heb -- https://github.com/ConnyHeb

import java.util.Scanner;

public class hello_world {

    public static void main(String[] args) {

        Scanner scan = new Scanner(System.in);
        System.out.println("Enter your name: ");
        String name = scan.next();
        System.out.println("Hello " + name + "!");

    }


}
