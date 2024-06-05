export default function random(): number {

   const min = 1000000;
   const max = 9999999;
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function capitalizeFirstLetter(input: string): string {

   return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function isEmailValid (email: string) : boolean {
   return /\S+@\S+\.\S+/.test(email);
};