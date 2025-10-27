import { useState, useEffect } from 'react';
import { Vote, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useWeb3V2 } from '../contexts/Web3ContextV2';
import { ProposalType } from '../contracts/desertWifiNodesV2Config';

interface Proposal {
  id: number;
  proposer: string;
  description: string;
  targetNodeId: number;
  proposalType: number;
  newValue: number;
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
  expiresAt: number;
  executed: boolean;
}

export default function GovernancePanel() {
  const { account, canParticipateInGovernance, getUserReputation, voteOnProposal, executeProposal, getProposalDetails, isLoading } = useWeb3V2();
  const [canGovernance, setCanGovernance] = useState(false);
  const [userReputation, setUserReputation] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    async function checkEligibility() {
      if (account) {
        const eligible = await canParticipateInGovernance(account);
        const reputation = await getUserReputation(account);
        setCanGovernance(eligible);
        setUserReputation(Number(reputation));
      }
    }
    checkEligibility();
  }, [account]);

  useEffect(() => {
    async function loadProposals() {
      const proposalList: Proposal[] = [];
      for (let i = 1; i <= 10; i++) {
        const proposal = await getProposalDetails(i);
        if (proposal && proposal.proposer !== '0x0000000000000000000000000000000000000000') {
          proposalList.push({
            id: i,
            proposer: proposal.proposer,
            description: proposal.description,
            targetNodeId: Number(proposal.targetNodeId),
            proposalType: proposal.proposalType,
            newValue: Number(proposal.newValue),
            votesFor: Number(proposal.votesFor),
            votesAgainst: Number(proposal.votesAgainst),
            createdAt: Number(proposal.createdAt),
            expiresAt: Number(proposal.expiresAt),
            executed: proposal.executed,
          });
        }
      }
      setProposals(proposalList);
    }
    loadProposals();
  }, [account]);

  const getProposalTypeName = (type: number) => {
    switch (type) {
      case ProposalType.UPDATE_TREASURY_FEE:
        return 'Update Treasury Fee';
      case ProposalType.REMOVE_NODE:
        return 'Remove Node';
      case ProposalType.UPDATE_MIN_REPUTATION:
        return 'Update Min Reputation';
      case ProposalType.TREASURY_WITHDRAWAL:
        return 'Treasury Withdrawal';
      default:
        return 'Unknown';
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      await voteOnProposal(proposalId, support);
      window.location.reload();
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handleExecute = async (proposalId: number) => {
    try {
      await executeProposal(proposalId);
      window.location.reload();
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const isExpired = (expiresAt: number) => {
    return Date.now() / 1000 > expiresAt;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Vote className="w-8 h-8 text-teal-600" />
            Governance
          </h2>
          <p className="text-gray-600 mt-2 font-medium">Community-driven decision making</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-coral-50 rounded-2xl p-6 mb-8 border-2 border-teal-100">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-xl">
            <TrendingUp className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600 font-bold">Your Reputation Score</div>
            <div className="text-3xl font-extrabold text-gray-900">{userReputation}</div>
            <div className="text-sm text-gray-600 mt-1">
              {canGovernance ? (
                <span className="text-teal-600 font-bold">✓ Eligible for Governance</span>
              ) : (
                <span className="text-gray-500">Need 100+ reputation for governance</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No proposals yet. Create the first one!
          </div>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                      {getProposalTypeName(proposal.proposalType)}
                    </span>
                    {proposal.executed && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        Executed
                      </span>
                    )}
                    {isExpired(proposal.expiresAt) && !proposal.executed && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expired
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{proposal.description}</h3>
                  <p className="text-sm text-gray-600">
                    Proposed by {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                  </p>
                  {proposal.targetNodeId > 0 && (
                    <p className="text-sm text-gray-600 mt-1">Target Node: #{proposal.targetNodeId}</p>
                  )}
                  {proposal.newValue > 0 && (
                    <p className="text-sm text-gray-600 mt-1">New Value: {proposal.newValue}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-teal-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-teal-700 mb-1">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">For</span>
                  </div>
                  <div className="text-2xl font-extrabold text-teal-700">{proposal.votesFor}</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <XCircle className="w-5 h-5" />
                    <span className="font-bold">Against</span>
                  </div>
                  <div className="text-2xl font-extrabold text-red-700">{proposal.votesAgainst}</div>
                </div>
              </div>

              {canGovernance && !proposal.executed && !isExpired(proposal.expiresAt) && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVote(proposal.id, true)}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl font-bold transition-all"
                    disabled={isLoading}
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, false)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold transition-all"
                    disabled={isLoading}
                  >
                    Vote Against
                  </button>
                </div>
              )}

              {canGovernance &&
                !proposal.executed &&
                !isExpired(proposal.expiresAt) &&
                proposal.votesFor > proposal.votesAgainst && (
                  <button
                    onClick={() => handleExecute(proposal.id)}
                    className="w-full mt-3 bg-gradient-to-r from-teal-500 to-coral-500 text-white px-4 py-2 rounded-xl font-bold hover:shadow-xl transition-all"
                    disabled={isLoading}
                  >
                    Execute Proposal
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
