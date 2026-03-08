import React from 'react';
import DashboardLayout from './DashboardLayout';

const Dashboard = () => (
	<DashboardLayout>
		<section>
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
				<div className="flex gap-6">
					<div className="bg-white rounded shadow p-4 w-64">
						<div className="font-semibold text-lg">Advance UI/UX Design</div>
						<div className="text-xs text-gray-500 mb-2">DESIGN</div>
						<div className="mb-2"><span className="text-brand">18/40 Lessons</span> • 2 hours left</div>
						<button className="text-brand font-semibold">Resume Course</button>
					</div>
					<div className="bg-white rounded shadow p-4 w-64">
						<div className="font-semibold text-lg">Basic Web Development</div>
						<div className="text-xs text-gray-500 mb-2">DEVELOPMENT</div>
						<div className="mb-2"><span className="text-brand">18/40 Lessons</span> • 2 hours left</div>
						<button className="text-brand font-semibold">Resume Course</button>
					</div>
				</div>
			</div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Recommended Courses For You</h2>
				<div className="grid grid-cols-2 gap-6">
					<div className="bg-white rounded shadow p-4">
						<div className="mb-2"><img src="https://dummyimage.com/320x180/eee/333&text=Course+1" alt="Course 1" className="rounded" /></div>
						<div className="font-semibold">Webflow Tutorial: Build Your First Portfolio Website In a Minute</div>
						<div className="text-xs text-gray-500">Adam Smith</div>
						<div className="flex items-center gap-2 mt-2">
							<span className="text-brand font-bold">4.7</span>
							<span className="text-gray-500">(320)</span>
							<span className="text-gray-700">$12.99</span>
						</div>
					</div>
					<div className="bg-white rounded shadow p-4">
						<div className="mb-2"><img src="https://dummyimage.com/320x180/eee/333&text=Course+2" alt="Course 2" className="rounded" /></div>
						<div className="font-semibold">Basic To Advance Design System With UX Strategies</div>
						<div className="text-xs text-gray-500">Scott Warden</div>
						<div className="flex items-center gap-2 mt-2">
							<span className="text-brand font-bold">4.7</span>
							<span className="text-gray-500">(540)</span>
							<span className="text-gray-700">$49.99</span>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-6">
				<div className="bg-white rounded shadow p-4 col-span-1">
					<div className="font-semibold mb-2">Weekly Streak</div>
					<div className="text-xs text-gray-500 mb-2">4/4 Weeks</div>
					<div className="flex gap-2 mb-2">
						<span className="bg-brand bg-opacity-10 text-brand rounded px-2">Mon 29</span>
						<span className="bg-brand bg-opacity-10 text-brand rounded px-2">Tue 30</span>
						<span className="bg-brand bg-opacity-10 text-brand rounded px-2">Wed 31</span>
					</div>
					<div className="text-xs text-gray-500">May 2024</div>
				</div>
				<div className="bg-white rounded shadow p-4 col-span-1">
					<div className="font-semibold mb-2">Courses</div>
					<div className="text-xs text-gray-500 mb-2">3 Courses In Progress</div>
					<div className="text-xs text-gray-500">17 Courses Completed</div>
				</div>
				<div className="bg-white rounded shadow p-4 col-span-1">
					<div className="font-semibold mb-2">Weekly Watch Time</div>
					<div className="text-xs text-gray-500 mb-2">4/4 Weeks</div>
					<div className="flex items-center gap-2">
						<span className="bg-brand bg-opacity-10 text-brand rounded px-2">4:24m</span>
					</div>
				</div>
			</div>
		</section>
		<aside className="absolute top-20 right-8 w-72 bg-white rounded shadow p-4">
			<div className="font-semibold text-lg mb-2">Brooklyn Simmons</div>
			<div className="text-xs text-gray-500 mb-2">UI/UX Designer & Developer</div>
			<div className="font-bold text-brand mb-2">876 Points</div>
			<div className="flex gap-4 mb-2">
				<div className="text-center">
					<div className="font-bold">54</div>
					<div className="text-xs text-gray-500">Days Streak</div>
				</div>
				<div className="text-center">
					<div className="font-bold">06</div>
					<div className="text-xs text-gray-500">Goals in Month</div>
				</div>
				<div className="text-center">
					<div className="font-bold">02</div>
					<div className="text-xs text-gray-500">2nd Place</div>
				</div>
			</div>
		</aside>
	</DashboardLayout>
);

export default Dashboard;