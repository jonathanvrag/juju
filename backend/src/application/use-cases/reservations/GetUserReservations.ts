import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../domain/entities/Reservation';

export class GetUserReservations {
  constructor(private reservationRepository: IReservationRepository) {}

  async execute(userId: string): Promise<Reservation[]> {
    return await this.reservationRepository.findByUserId(userId);
  }
}
