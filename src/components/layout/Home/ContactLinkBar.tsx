'use client';

import Link from 'next/link';

export default function ContactLinkBar() {
    return (
        <div className="flex-grow-0 flex-shrink-0 w-[767px] h-[227px] relative overflow-hidden">
            <div className="w-[124px] h-[114px] absolute left-[94.5px] top-[57px] overflow-hidden cursor-pointer">
                <Link href="#"> {/*이메일 링크 미구현*/}
                    <img
                        src="home_img/email_icon.png"
                        className="w-[100px] h-[100px] absolute left-[11.5px] top-1.5 object-cover"
                    />
                </Link>
            </div>
            <div className="w-[121px] h-[117px] absolute left-[323.5px] top-[54px] overflow-hidden cursor-pointer">
                <Link href="#"> {/*깃허브 링크 미구현*/}
                    <img
                        src="home_img/github_icon.png"
                        className="w-[100px] h-[100px] absolute left-[9.5px] top-[9px] object-cover"
                    />
                </Link>
            </div>
            <div className="w-[129px] h-[116px] absolute left-[539.5px] top-[55px] overflow-hidden cursor-pointer">
                <Link href="#"> {/*디스코드 링크 미구현*/}
                    <img
                        src="home_img/discord_icon.png"
                        className="w-[115px] h-[115px] absolute left-[4.5px] top-0 object-cover"
                    />
                </Link>
            </div>
        </div>
    );
}