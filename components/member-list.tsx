import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Member = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
};

interface MemberListProps {
    isLoading: boolean;
    members: Member[];
}

export function MemberList({ isLoading, members }: MemberListProps) {
    if (isLoading) {
        return <div>Loading members...</div>; // Or a skeleton loader
    }

    if (!members.length) {
        return <p className="text-[#bac2de] text-center py-4">No members found.</p>;
    }

    return (
        <div className="space-y-4">
            {members.map((member) => (
                <motion.div
                    key={member.id}
                    className="flex items-center gap-4 bg-[#313244] p-4 rounded-lg border border-[#45475a]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image || ""} alt={member.name || ""} />
                        <AvatarFallback className="bg-[#45475a] text-[#cdd6f4]">
                            {member.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-[#cdd6f4] font-medium">{member.name || "Anonymous"}</p>
                        <p className="text-sm text-[#bac2de]">{member.email}</p>
                        <p className="text-xs text-[#bac2de]">Joined: {new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}