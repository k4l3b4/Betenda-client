import { ReactType } from "@/api/requests/reactions/requests";
import { ReactionsType } from "@/types/global";

type ReactionState = {
    reactions: ReactionsType,
    setReactions: React.Dispatch<React.SetStateAction<any>>
}

interface ReactionCdType extends ReactionState {
    data: ReactType
}

export const handleNewReaction = ({ reactions, setReactions, data }: ReactionCdType) => {
    const existingReaction = reactions.reaction_count.find(
        (reaction) => reaction.reaction === data.reaction
    );

    // Create a new array with the updated count for the emoji
    const updatedReactionCount = existingReaction
        ? reactions.reaction_count.map((reaction) =>
            reaction.reaction === data.reaction
                ? { ...reaction, count: reaction.count + 1 }
                : reaction
        )
        : [...reactions.reaction_count, { reaction: data.reaction, count: 1 }];

    // Set the new reaction and updated count in the state
    setReactions({
        user_reacted_with: data.reaction,
        reaction_count: updatedReactionCount,
    });
};



export const handleReactionUpdate = ({ reactions, setReactions, data }: ReactionCdType) => {
    if (!reactions.user_reacted_with) {
        // No previous reaction to update
        return;
    }

    // Check if the emoji is already in the reaction_count array
    const existingReaction = reactions.reaction_count.find(
        (reaction) => reaction.reaction === reactions.user_reacted_with
    );

    if (!existingReaction) {
        // If the previous reaction doesn't exist in reaction_count, return.
        return;
    }

    // Create a new array with the updated count for the previous emoji
    const updatedReactionCount = reactions.reaction_count.map((reaction) =>
        reaction.reaction === reactions.user_reacted_with
            ? { ...reaction, count: reaction.count - 1 }
            : reaction
    ).filter((reaction) => reaction.count > 0); // Remove reactions with count <= 0

    // Check if the new emoji is already in the reaction_count array
    const newReaction = updatedReactionCount.find(
        (reaction) => reaction.reaction === data.reaction
    );

    // Create a new array with the updated count for the new emoji
    const updatedReactionCountWithNewReaction = newReaction
        ? updatedReactionCount.map((reaction) =>
            reaction.reaction === data.reaction
                ? { ...reaction, count: reaction.count + 1 }
                : reaction
        )
        : [...updatedReactionCount, { reaction: data.reaction, count: 1 }];

    // Set the new reaction and updated count in the state
    setReactions({
        user_reacted_with: data.reaction,
        reaction_count: updatedReactionCountWithNewReaction,
    });
};




// export const handleReactionUpdate = ({ reactions, setReactions, data }: ReactionCdType) => {
//     if (!reactions.user_reacted_with) {
//         // No previous reaction to update
//         return;
//     }

//     // Check if the emoji is already in the reaction_count array
//     const existingReaction = reactions.reaction_count.find(
//         (reaction) => reaction.reaction === reactions.user_reacted_with
//     );

//     // Create a new array with the updated count for the previous emoji
//     const updatedReactionCount = existingReaction
//         ? reactions.reaction_count.map((reaction) =>
//             reaction.reaction === reactions.user_reacted_with
//                 ? { ...reaction, count: reaction.count - 1 }
//                 : reaction
//         )
//         : reactions.reaction_count;

//     // Set the new reaction and updated count in the state
//     setReactions({
//         user_reacted_with: data.reaction,
//         reaction_count: updatedReactionCount,
//     });
// };



export const handleReactionDelete = ({ reactions, setReactions }: ReactionState) => {
    if (!reactions.user_reacted_with) {
        // No previous reaction to delete
        return;
    }

    // Find the previous reaction in the reaction_count array
    const previousReaction = reactions.reaction_count.find(
        (reaction) => reaction.reaction === reactions.user_reacted_with
    );

    if (!previousReaction) {
        // If the previous reaction doesn't exist in reaction_count, return.
        return;
    }

    // Create a new array with the updated count for the previous reaction
    const updatedReactionCount = reactions.reaction_count.map((reaction) =>
        reaction.reaction === reactions.user_reacted_with
            ? { ...reaction, count: reaction.count - 1 }
            : reaction
    ).filter((reaction) => reaction.count > 0); // Remove reactions with count <= 0

    // Set the new reaction and updated count in the state
    setReactions({
        user_reacted_with: null,
        reaction_count: updatedReactionCount,
    });
};




// export const handleReactionDelete = ({ reactions, setReactions }: ReactionState) => {
//     if (!reactions.user_reacted_with) {
//         // No previous reaction to delete
//         return;
//     }
//     // Create a new array without the previous reaction
//     const updatedReactionCount = reactions.reaction_count.filter(
//         (reaction) => reaction.reaction !== reactions.user_reacted_with
//     );

//     // Set the new reaction and updated count in the state
//     setReactions({
//         user_reacted_with: null,
//         reaction_count: updatedReactionCount,
//     });
// };
