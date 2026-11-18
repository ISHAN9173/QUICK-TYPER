--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.test_history DROP CONSTRAINT IF EXISTS test_history_user_id_fkey;
DROP INDEX IF EXISTS public.idx_test_history_user;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.test_history DROP CONSTRAINT IF EXISTS test_history_pkey;
ALTER TABLE IF EXISTS ONLY public.feedback DROP CONSTRAINT IF EXISTS feedback_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.test_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.feedback ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.test_history_id_seq;
DROP TABLE IF EXISTS public.test_history;
DROP SEQUENCE IF EXISTS public.feedback_id_seq;
DROP TABLE IF EXISTS public.feedback;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: test_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    wpm integer NOT NULL,
    accuracy numeric(5,2) NOT NULL,
    errors integer DEFAULT 0 NOT NULL,
    duration integer NOT NULL,
    typed_date character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.test_history OWNER TO postgres;

--
-- Name: test_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_history_id_seq OWNER TO postgres;

--
-- Name: test_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_history_id_seq OWNED BY public.test_history.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    theme character varying(30) DEFAULT 'indigo'::character varying,
    goal_wpm integer DEFAULT 40,
    streak_current integer DEFAULT 0,
    streak_longest integer DEFAULT 0,
    streak_last_date date,
    practice_count integer DEFAULT 0,
    unlocked_badges text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: test_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_history ALTER COLUMN id SET DEFAULT nextval('public.test_history_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, name, email, message, created_at) FROM stdin;
1	cxsxs	pateldharmik4239@gmail.com	ewdfewfrfrf	2026-10-23 16:20:52.901422+05:30
2	dede	pateldharmik4239@gmail.com	dedeededededededed	2026-10-23 17:13:11.732093+05:30
3	g6gy	pateldharmik4239@gmail.com	yyhyhy55y5y\n	2026-10-23 21:57:31.329414+05:30
4	hb	pateldharmik4239@gmail.com	iuhu8yiuiiuj	2026-10-24 01:15:20.138716+05:30
\.


--
-- Data for Name: test_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_history (id, user_id, wpm, accuracy, errors, duration, typed_date, created_at) FROM stdin;
3	1	19	85.00	17	60	10/24/2026	2026-10-24 00:55:17.925909+05:30
4	1	23	93.00	8	60	10/24/2026	2026-10-24 00:56:29.95552+05:30
5	1	22	88.00	15	60	10/24/2026	2026-10-24 00:57:48.703911+05:30
6	2	23	97.00	4	60	10/24/2026	2026-10-24 01:12:25.285227+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, theme, goal_wpm, streak_current, streak_longest, streak_last_date, practice_count, unlocked_badges, created_at) FROM stdin;
2	dp	pateldharmik4239@gmail.com	$2b$10$4BtaUjhtS06F.5m.Xdf4/efxRjBj5hM16GFmkNxnBaO9LKvDS6OTW	indigo	40	0	0	\N	6	{}	2026-10-23 16:21:28.144276+05:30
3	pp	thesardar@gmail.com	$2b$10$A.BDNxj24L2MiADUXMv8D.4fgv86vSMvwVDjcKb9xy0FhN66UteH6	indigo	40	0	0	\N	0	{}	2026-10-23 22:01:23.661823+05:30
1	Admin	admin@gmail.com	$2b$10$VDtXLc0IrCYu8r4Bs3sZjuKQzxzYQscT3ZazbYiJR2Ilhx/EbnD7m	indigo	40	0	0	\N	48	{}	2026-10-22 15:22:42.533225+05:30
\.


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 4, true);


--
-- Name: test_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_history_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: test_history test_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_history
    ADD CONSTRAINT test_history_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_test_history_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_test_history_user ON public.test_history USING btree (user_id);


--
-- Name: test_history test_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_history
    ADD CONSTRAINT test_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

