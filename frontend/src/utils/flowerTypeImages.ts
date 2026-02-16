import anniversaryImg from '@/assets/occasions/anniversary.png';
import birthdayImg from '@/assets/occasions/birthday.png';
import funeralImg from '@/assets/occasions/funeral.png';
import getWellImg from '@/assets/occasions/get_well.png';
import justBecauseImg from '@/assets/occasions/just_becuase.png';
import mothersDayImg from '@/assets/occasions/mothers_day.png';
import newBornImg from '@/assets/occasions/new_born.png';
import romanceImg from '@/assets/occasions/romance.png';
import sympathyImg from '@/assets/occasions/sympathy.png';
import thankYouImg from '@/assets/occasions/thank_you.png';
import weddingImg from '@/assets/occasions/wedding.png';
import medFlowers from '@/assets/med_flowers.png';

export const OCCASION_IMAGES: Record<string, string> = {
  'Anniversary': anniversaryImg,
  'Birthday': birthdayImg,
  'Funeral': funeralImg,
  'Get Well': getWellImg,
  'Just Because': justBecauseImg,
  "Mother's Day": mothersDayImg,
  'New Born': newBornImg,
  'Romance': romanceImg,
  'Sympathy': sympathyImg,
  'Thank You': thankYouImg,
  'Wedding': weddingImg,
};

export const DEFAULT_FLOWER_IMAGE = medFlowers;
