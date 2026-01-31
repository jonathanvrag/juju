export interface CreateReservationDto {
  bookId: string;
  userId: string;
  expirationDate: Date;
}

export interface UpdateReservationDTO {
  status?: 'active' | 'cancelled' | 'expired' | 'fulfilled';
}
