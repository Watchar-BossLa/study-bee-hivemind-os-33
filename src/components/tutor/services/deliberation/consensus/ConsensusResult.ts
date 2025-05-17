
import { CouncilVote } from '../../../types/councils';

export interface ConsensusResult {
  suggestion: string;
  confidence: number;
  votes?: CouncilVote[];
  suspiciousVotes?: CouncilVote[];
}
