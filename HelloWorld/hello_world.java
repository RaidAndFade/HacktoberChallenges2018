//Made by Sourav Prasad (https://github.com/souravpd)
import java.io.*;

public class HelloWorld{

    public static void main(String args[])throws IOException{
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("Enter your name:");
        String name = br.readLine().trim();
        System.out.println("Hello "+name+"!");
    }
}